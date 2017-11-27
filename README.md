# fb-page-post-insights
Grab all Facebook pages that belong to a user, process their posts and run insights on them

**Disclaimer - The function of this code is bespoke to BBC and is meant for transparant engineering or code reviews**

_Written and Tested with NodeJS v8.4.0 on macOS X 10.12.6_

## What is it?
A script for grouping together posts made from multiple Facebook pages.

## Why create it?
I have two system accounts, each with about 120 Facebook Pages for various sub brands of the BBC. Shows like Newsnight and Victoria Darbishire have their own Facebook pages, which share a broad range of their own content, organisation content (BBC) and external content (3rd party).

I want to be able to find all the subbrand Pages that BBC content was promoted on, aggregate their engagement (shares, reactions, comments) and give the creater of that content an idea of how their work performed and reached people.

## How does it work?
You will need a system account token (created through business manager) and app secret (the app which is assosiated to your business). Once the system account has all Page assets assigned to it,  it will retireve all the Pages with thier tokens. Each page is called with their token and the last 100 posts is retuned. 

In order to aggregate link shares on posts, we have to find out what the cononical id is. Luckily, we include this in the shared url. Unfortuantly, the shared url is shortened and the id is lost. So the script visits all the urls that have been shared finding the original url and extracts the cononical id from it.

The script will further filter down posts that we care about by looking at the type of id. Once we have our final list of posts we want infomation on, the object_id (post id) is sent to the insights edge and insights are returned.

## Whats next?
I want to show the number of people who became fans of the page from clicking on the like button in the page post. Not where sure this end point is.

## How to use

`git clone https://github.com/danm/fb-business-page-post-insights.git`
`cd fb-business-page-post-insights`
`npm i`
`./bin/fbposts <system user token> <app secret>`

Your app must have `Require App Secret` which on in the [advanced settings](https://developers.facebook.com/apps/<appid>/settings/advanced/). This is the same place you grab the app secret from.

## Example respons

```json
{
    "permalink_url": "https://www.facebook.com/BBCFamilyNews/posts/<postid>",
    "type": "link",
    "link": "http://www.bbc.co.uk/news/uk-politics-42078457",
    "message": "#Grangela - love it! 🙋 not 👵",
    "name": "BBC Family & Education News",
    "comments": 4,
    "shares": 2,
    "id": "<pageid>_<postid>",
    "host": "www.bbc.co.uk",
    "pathname": "/news/uk-politics-42078457",
    "reactions": {
        "like": 52,
        "love": 5,
        "wow": 3,
        "haha": 0,
        "sorry": 0,
        "anger": 0
    },
    "engagedUsers": 1410,
    "engagedFans": 1305
},..
```
