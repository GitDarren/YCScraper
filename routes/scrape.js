//Dependencies
const express = require('express');
const cheerio = require("cheerio");
const router = express.Router();
const rp = require('request-promise');
const db = require("../models");



//Get Route for scraping NYTimes Sports Section

router.get("/newArticles", function(req, res)   {
    //configuring options object for request-promise (not quite sure what this means at this point)
    const options = {
        uri: 'https://www.nytimes.com/section/sports',
        transform: function(body)   {
            return cheerio.load(body);
        }
    };

    //caling the database to return all the saved articles
    db.Article
        .find({})
        .then((savedArticles)   =>  {
            //creating an array of saved articles headlines
            let savedHeadlines = savedArticles.map(article => article.headline)

            //calling request promise with options object
            rp(options) 
            .then(function  ($) {
                let newArticleArr = [];
                //iterating over returned articles and creating a newArticle object from the data
                $('#latest-panel article.story.theme-summary').each((i, element) =>  {
                    let newArticle = new db.Article ({
                        storyUrl: $(element).find('.story-body>.story-link').attr("href"),
                        headline: $(element).find('h2.headline').text().trim(),
                        summary: $(element).find('p.summary').text().trim(),
                        imgUrl: $(element).find('img').attr('src'),
                        byLine: $(element).find('p.byline').text().trim()
                    });
                    //check to make sure newArticle contains a storyUrl
                    if (newArticle.storyUrl)    {
                        //checking if new article matches any saved article, if not add it to the array of new articles
                        if (!savedHeadlines.includes(newArticle.headline))  {
                            newArticleArr.push(newArticle);
                        }
                    }
                });//end of function
                
                //adding all the new articles to the database
                db.Article
                    .create(newArticleArr)
                    .then(result => res.json({count: newArticleArr.length}))//returning the count of the new articles to front end
                    .cath(err => console.log(err))//end of rp method
            })
            .catch(err => console.log(err))//end of db.Article.find()
        });// end of get request to /scrape
})

module.exports = router;