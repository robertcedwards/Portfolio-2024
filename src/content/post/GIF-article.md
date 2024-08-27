---
title: "Building a PFP GIF tool w/ Airstack"
description: 'Please enter a description of your post here, between 50-160 chars!'
publishDate: 28 March 2024
tags: [article]
draft: false
---
## Backstory
After the last build where we built a tool combining [Neynar](https://neynar.com/) & [Airstack](https://airstack.xyz/), this round we're going to focus on creating a solution solely using Airstack.  
The last tool was a narrowly focused solution for specific problem, this time, we're going to make something that has a broader market fit and more people might actually find fun and useful!  

![](https://storage.googleapis.com/papyrus_images/7f0c1cc04a1c89cb5f9e3af7d2f8f1ac.gif)

willywonka.eth 🗑🎩🌈 avatar

At ETHDenver, our friends from ATXDAO were launching a new PFP project called [TrashNFTs](https://www.trashnfts.com/) based on the new ERC-404 standard and we got to talking about how the team's profiles had a GIF with their favorite NFTs.  

![](https://storage.googleapis.com/papyrus_images/c251c3a5c5c780d3cea5e4b028716167.png)

Warpcast DC Convo between 0xHashbrown <-> Willyogo

I asked **willywonka.eth (**[**https://warpcast.com/willyogo**](https://warpcast.com/willyogo)**)** about how he created their profile images and mentioned using [Canva's GIF tool](https://www.canva.com/create/gif-maker/). It was clear, this could be a tool I could build that was interesting to people in the space + something to potentially integrate into a Frame to make it more accessible and interactive.

The ideation phase was over and it was time to build a tool so anyone can enter their ENS and get a GIF back with their favorite NFTs.

Now that we have our idea, let's structure the app before we write any code.

## **Structure**

We'll need a basic HTML/CSS structure, some sort of library for GIF creation, and [Airstack](https://airstack.xyz/) to fetch blockchain data.

Let's expand on this slightly. Basically, the user will be served HTML with a form to enter their ENS/Wallet Address, if valid, using the front-end script, submit ENS/Wallet address to our back-end script that contains our Airstack GraphQL Query. That will return an array of data via a json response with the images that will be display in a grid, allowing the user to select NFT images then create and download an animated GIF.

![](https://storage.googleapis.com/papyrus_images/33f32183a8ad092557cd04972502400b.png)

App Structure & Flow Diagram

This structure and flow helps us understand how the data moves within the app, the necessary files, and how to interconnect them. Now we can sort out what tools we need to accomplish our desired functionality.

First, we'll tackle using [Airstack](https://airstack.xyz/) to get our blockchain data. Airstack is web3 native tool, enabling developers to integrate blockchain data into their dApps easily.

We'll be using [Airstack](https://airstack.xyz/), [@airstack/node](https://docs.airstack.xyz/airstack-docs-and-faqs/get-started/quickstart/node), and their [API studio](https://app.airstack.xyz/api-studio) to help craft our GraphQL query. They have an awesome AI Assistant tool that uses natural language to create GraphQL automagically 🪄.

![](https://storage.googleapis.com/papyrus_images/5514ce6b7e384b3c25e3546929e1ccff.png)

It's a wonderful way to explore Airstack and learn how to query all of the data easily and they have shared public queries.

Here's an example of the query we'll be using to fetch Minted NFTs to avoid random spam/airdrops. Airstack also has a [spam attribute](https://docs.airstack.xyz/airstack-docs-and-faqs/guides/nft/spam-nft) to filter against NFTs that have been labeled, but for the sake of simplicity here, we'll use just NFTs that the user has minted.

![](https://storage.googleapis.com/papyrus_images/4e2cf9fec87f512313f96bb7cfb45fd7.gif)

## Airstack API Explorer with AI Assistant

In this example, I queried the User:0xHashbrown, but for our example, we'll pass variables via the GraphQL query.

Here's the our actual query will be using with the variable definitions so they'll be valid for the call. I'm only going to include the ETH example here, but you can download the full code/query at the bottom of the article which includes all multiple blockchains.

    query GetTokens($tokenType: [TokenType!], $limit: Int, $sortBy: OrderBy, $owner: Identity) {
        
      ethereum: TokenBalances(
        input: {filter: {owner: {_eq: $owner},tokenType: {_in: $tokenType}}, blockchain: ethereum, limit: $limit, order: {lastUpdatedTimestamp: $sortBy}}
      ) {
        TokenBalance {
          
          amount
    tokenType
    blockchain
    formattedAmount
    tokenId
    tokenAddress
    lastUpdatedTimestamp
    owner {
        addresses
    }
    tokenNfts {
        tokenId
        contentValue {
            image {
              medium
            }
        }
        erc6551Accounts {
          address {
            addresses
            tokenBalances {
              tokenAddress
              tokenId
              tokenNfts {
                contentValue {
                  image {
                    medium
                  }
                }
              }
            }
          }
        }
    }
    token {
      isSpam
      name
      symbol
      logo {
        small
      }
      projectDetails {
        imageUrl
      }
    }
    tokenTransfers(input: {filter: {from: {_eq: "0x0000000000000000000000000000000000000000"},operator: {_eq: $owner},to: {_eq: $owner}}, order: {blockTimestamp: ASC}, limit: 1}) {
        type
      }
    
        }
      }

![](https://storage.googleapis.com/papyrus_images/644d28dd9061eeca9750c3b4ea1509d0.png)

Getting started with Airstack is super easy. You'll need a free account, and if you sign-up with your ENS/Farcaster/Lens account, they'll give you a $50 Credit, plus if you provide a CC card, you'll be able to use a Test API key that doesn't count against your credits.

Now that we have our query, we'll need to create our back-end that will serve an API route so we can use the form data containing the ENS or Wallet Address, and the function that will use that data to fetch the NFTs from Airstack.  

## **Project Setup**

Now that we have our structure and tools sorted out, let's initialize our project.

    npm install express @airstack/node dotenv

This installs our [Express server](https://expressjs.com/), [Airstack's Node.js library](https://docs.airstack.xyz/airstack-docs-and-faqs/nodejs-sdk-reference/overview), and [dotenv](https://www.dotenv.org/blog/2023/03/13/how-to-use-dotenv.html) for storing our Airstack API key safely in a .env file locally or stored as environmental variables for your deployment.

Next we'll initialize Express, import init & fetchQuery from @airstack/node, and load our environmental variables from our .env, start our Express server at port 3000, and initialize our Airstack API key from .env.

    const express = require('express');
    const { init, fetchQuery } = require("@airstack/node");
    require('dotenv').config();
    
    const app = express();
    const PORT = process.env.PORT || 3000;
    init(process.env.AIRSTACK_API_KEY);

We'll need to define our query to Airstack next. We'll use the query that we created with Airstack's API Studio. We'll use the full query here, but below is the basic definition for it.

    const query = `FULL AIRSTACK QUERY HERE`

Now we need to setup Express to serve our static files.

    app.use(express.static('public'));

Next we'll need to create our API route function for the /api/fetch-nfts endpoint for our front-end.js to call. It will then extract the ENS Address, validate the input, query our variables, fetch the NFT data, check for errors in the data and handle server errors, and finally return our successful response.

    app.get('/api/fetch-nfts', async (req, res) => {
        const ensAddress = req.query.ensAddress;
    
        if (!ensAddress) {
            return res.status(400).send({ error: 'ENS address is required.' });
        }
    
        const variables = {
            tokenType: ["ERC721"],
            limit: 10,
            sortBy: "DESC",
            owner: ensAddress
        };
    
        try {
            const { data, errors } = await fetchQuery(query, variables);
    
            if (errors) {
                console.error("Error fetching NFT data:", errors);
                return res.status(500).send({ error: 'Failed to fetch NFT data.' });
            }
    
            res.send(data);
        } catch (error) {
            console.error("Server error:", error);
            res.status(500).send({ error: 'Internal server error.' });
        }
    });

Now that we have an Express Server to handle our static files, the ENS input, and fetching and returning the data, we can move on to our front-end to create the HTML/CSS/JS that takes the user's input, fetches the NFT images, displays them on the page, allows the user to select the desired NFTs, previews them, and ultimately creates the GIF.

## **Frontend**

Let's setup a basic front-end with HTML and [Tailwind](https://tailwindcss.com) for styling.

We'll include some basic HTML/utility classes for Tailwind and includes a front-end.js script.  
The code below has the HTML structure to include the javascript, CSS, form and the "Make GIF" button. There are also DIVs to contain the returned images, a preview, and the GIF output.

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NFT Gallery from ENS</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
        <link href="style.css" rel="stylesheet">
        <script defer src="front-end.js"></script>
    </head>
    <body class="bg-gray-900 text-white">
        <div class="container mx-auto px-4 py-12">
            <h1 class="text-3xl font-bold text-center mb-6">Fetch NFTs and Create GIF</h1>
            <div class="flex justify-center mb-8">
                <input type="text" id="ensAddress" placeholder="ENS Address" class="input border border-gray-700 p-2 text-black">
                <button id="fetchNfts" class="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Fetch NFTs</button>
            </div>
            <div id="nftGallery" class="carousel grid grid-cols-1 md:grid-cols-3 gap-4">
            </div>
    
            <div id="gifOutput" class="mt-8">
            </div>
        </div>
        <footer id="stickyFooter" class="sticky-footer sticky inset-x-0 bottom-0 bg-gray-200 text-center p-4">
            <div id="selectedImagesPreview" class="preview-area"></div>
            <button id="createGifButton" class="mt-8 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Make GIF</button>
        </footer>
         
    </body>
    </html>

Next up, we'll build the front-end.js script.  
First setup an event listener for the "Fetch NFTs" button to send the address to our API route (more on this when we build back-end.js). Then the functions for displaying the NFTs, user selecting the images, previewing those images, and finally creating the GIF once the user clicks on the "Make GIF" button.

  
This is an async function that checks for a valid address, otherwise alert the user. If valid, then await the json response and send that data to the next function -> displayNfts, otherwise catch the error.

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('fetchNfts').addEventListener('click', fetchAndDisplayNFTs);
    });
    
    let selectedImagesData = [];
    
    async function fetchAndDisplayNFTs() {
        const ensAddress = document.getElementById('ensAddress').value.trim();
        if (!ensAddress) {
            alert('Please enter a valid ENS address.');
            return;
        }
    
        try {
            const response = await fetch(`/api/fetch-nfts?ensAddress=${encodeURIComponent(ensAddress)}`);
            const data = await response.json();
            displayNfts(data);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        }
    }

This function setups the DOM modifications to update the HTML with the ID nftGallery, creates an object for each of the NFTs received by the script, a fallback image and sets an event listener for a 'click' to add a class 'selected' to each of the images.

    function displayNfts(data) {
        const gallery = document.getElementById('nftGallery');
        gallery.innerHTML = '';
        gallery.classList.add('carousel'); 
    
        Object.keys(data).forEach(blockchainKey => {
            const tokenBalances = data[blockchainKey].TokenBalance;
            tokenBalances.forEach(tokenBalance => {
                const imageUrl = tokenBalance.tokenNfts?.contentValue?.image?.medium || 'fallback-image-url.png';
    
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = tokenBalance.token?.name || 'NFT Image';
                imgElement.classList.add('nft-item');
                imgElement.addEventListener('click', function() {
                    this.classList.toggle('selected');
                    handleImageSelection(this, imageUrl);
                });
    
                gallery.appendChild(imgElement);
            });
        });
    }

Now that we have the HTML and javascript for handling the NFT images and selecting them, we'll need a way to create a GIF out of those images.

  
This function previews of the images that will be used for the GIF and displays them next to the "Make GIF" button.

    function updatePreviewAndButtonVisibility() {
        const previewArea = document.getElementById('selectedImagesPreview');
        previewArea.innerHTML = ''; 
    
        selectedImagesData.forEach(item => {
            const imgElement = document.createElement('img');
            imgElement.src = item.dataURL;
            imgElement.classList.add('preview-image'); 
            previewArea.appendChild(imgElement);
        });
    
        const createGifButton = document.getElementById('createGifButton');
        if (selectedImagesData.length > 0) {
            createGifButton.classList.remove('hidden');
        } else {
            createGifButton.classList.add('hidden');
        }
    }

Now that we have a list of images selected and previewed, we'll need a way to create the GIF from that array.  
[GIF.js](https://jnordberg.github.io/gif.js/?utm_source=cdnjs&utm_medium=cdnjs_link&utm_campaign=cdnjs_library) is an awesome library that let's you create GIFs right in the browser. We'll include the CDN file for this library. Just add this tag below our style.css:

        <script src="https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js"></script>

Let's set up the functions that "Make GIF" calls. This function will create the GIFs from a dataUrl that allows the browser to store "[data blobs](https://developer.mozilla.org/en-US/docs/Web/API/Blob)". This is due to browser security that prevents tainting an HTML Canvas with images urls from different domains. In this case, we're fetching the images from Airstack, but serving the Canvas on our hosted domain. This is a CORS workaround that will allow us to store the images from Airstack and use them to create the GIF.

First up is the function to convert the selected images into a data blob.

    function convertImageToDataURL(imageSrc, callback) {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; 
        img.onload = function() {
            const size = Math.min(img.width, img.height);
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 300; 
            const ctx = canvas.getContext('2d');
            const x = (canvas.width / 2) - (img.width / 2) * (size / img.width);
            const y = (canvas.height / 2) - (img.height / 2) * (size / img.height);
            ctx.drawImage(img, x, y, img.width * (size / img.width), img.height * (size / img.height));
            const dataURL = canvas.toDataURL('image/png');
            callback(dataURL);
        };
        img.src = imageSrc;
    }

And this function takes those data blobs and uses GIF.js and webworkers to sequentially add the images to the GIF with a 200ms delay between the images, completes the rendering of the GIF, updates the preview image, adds a download button, and scrolls to the bottom of the page.

    function createGifFromDataUrls(dataUrls) {
        if (dataUrls.length === 0) {
            console.log('No images selected for GIF creation.');
            return;
        }
    
        console.log('Create GIF button clicked');
    
        const gif = new GIF({
            workers: 2,
            quality: 10,
            workerScript: 'gif.worker.js', 
            width: 300, 
            height: 300,
        });
    
        let loadCount = 0;
    
        dataUrls.forEach(dataUrl => {
            const img = new Image();
            img.onload = () => {
                console.log('Adding image to GIF');
                gif.addFrame(img, { delay: 200 });
    
                loadCount++;
                if (loadCount === dataUrls.length) {
                    console.log('All images loaded, starting GIF render...');
                    gif.render();
                }
            };
            img.src = dataUrl;
        });
    
        gif.on('finished', function(blob) {
            const url = URL.createObjectURL(blob);
        
            let gifContainer = document.getElementById('gifContainer');
            if (!gifContainer) {
                gifContainer = document.createElement('div');
                gifContainer.id = 'gifContainer';
                gifContainer.classList.add('flex', 'flex-col', 'items-center', 'mt-4');
                document.body.appendChild(gifContainer);
            } else {
                gifContainer.innerHTML = ''; 
            }
        
            const previewImg = document.createElement('img');
            previewImg.src = url;
            gifContainer.appendChild(previewImg);
        
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'nft-collection.gif';
            downloadLink.textContent = 'Download GIF';
            downloadLink.id = 'download';
            downloadLink.classList.add('mt-8', 'bg-green-500', 'hover:bg-green-700', 'text-white', 'font-bold','py-2','px-4','rounded');
            gifContainer.appendChild(downloadLink);
            scrollToPageBottom();
        });
    };

We've completed the front-end.js so we can handle the images coming from our API call, a way to select and preview those images and finally a method to create the GIF and download it.

## **Note on Deployment**

Currently our app is structured with our HTML, CSS, and front-end.js in our public folder, with our back-end.js in our root. We'll need to move and rename back-end.js to api/index.ts. This is a deployment detail for [Vercel](https://vercel.com) in order to uses edge functions. Learn more here: [Express.js Guide](https://vercel.com/guides/using-express-with-vercel).

Let's install the needed packages and spin up a local dev version so we can take a look at what we've built. Run this from the root of the project.

    npm install && node api/index.ts

Now we can navigate to in our browser to [https://localhost:3000](https://localhost:3000) and check out our work.

![](https://storage.googleapis.com/papyrus_images/e110d706a6eaa2d97f94cf24b0a2fa4f.gif)

App running on localhost:3000

Looking good! Now that we've verified that it's working, we can focus on deployment.  
We'll need [Vercel](https://vercel.com/home) and [Github](https://github.com/) accounts, both free version will work for our purposes. Fork our project into your own account.


![](https://opengraph.githubassets.com/f17409c6e6a767bd7bdc9e19b27b28ab49c7c33ec804f2f3f6980cd891ccbae3/robertcedwards/Airstack-NFT-GIF-Builder)

https://github.com

## GitHub Repo
- [A tool built with Airstack to create an animated GIF from NFTs - robertcedwards/Airstack-NFT-GIF-Builder](https://github.com/robertcedwards/Airstack-NFT-GIF-Builder)

----------------------------------------------------------------------------------------------------------------

## Deploy

Once you have your fork you'll proceed to [Vercel](https://vercel.com/new) to import and deploy from there.

Login to your Vercel account and click Add new - Project. You'll see the screen below, import our Airstack-NFT-GIF-Builder repo.

![](https://storage.googleapis.com/papyrus_images/098f3d62a4d690cc862e0e181dcb1928.png)

Importing our Project from Github in to Vercel

We'll need to add an Environment Variable for our Airstack API Key. Add the key "AIRSTACK\_API\_KEY" and your API key in the value field. Vercel will auto-detect the rest of our configuration, so all we need to do it hit the Deploy button.

![](https://storage.googleapis.com/papyrus_images/ea772b2a3f7040f0830f8f8b1ac81f41.png)

Setting the Environment Variable for Airstack API + Deploy

Congrats 🚀🎉 - You've deployed a Airstacked powered NFT GIF maker!

From concept to ideation, back-end to front-end, we've come a long way. But hopefully this project helped you to better understand how to create any blockchain based project using the power of [Airstack](https://airstack.xyz/) and modern build & deployment tools.  
If you need any help, feel free to [reach out on Warpcast](https://warpcast.com/0xhashbrown). My DCs are open!

Now get out there and build something with [Airstack](https://airstack.xyz/) and share it in the [/airstack channel](https://warpcast.com/~/channel/airstack)!