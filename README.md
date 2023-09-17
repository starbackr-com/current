
![Logo](https://i.current.fyi/current/github/banner1.png)


# Current | Nostr + Bitcoin

The Current App for iOS and Android is an open source react-native client on top of the Nostr protocol.

[![Appstore](https://i.current.fyi/help/app-store-badge-blue.svg)](https://apps.apple.com/us/app/current-nostr-bitcoin/id1668517032)
[![Playstore](https://i.current.fyi/help/play-store-badge-blue.svg)](https://play.google.com/store/apps/details?id=io.getcurrent.current)

[![android](https://i.current.fyi/help/android-apk.png)](https://i.current.fyi/help/Current+App+v0.1.3-Alajuela.apk)

Update as of Sep 17th 2023 -  As of v0.1.3-Alajuela we successfully started to integrate AI features into the App. We now have full screen images on the home feed. Will focus more on creator AI tools and make Current App the go to tool for Causal and professional creators.


Update as of May 10th 2023 - As of v0.0.9-Tamrindo we successfully completed all base mode features and on par with other Nostr clients. We also implemnted expert mode feaures such as add/remove relays and using other lightning wallets.

We have implemented many unique features that exists only on Current. Such as
- Push Notifications from relays
- Wallet connect link to use Current wallet with other Nostr clients
- Easy on boarding for noobs coming from other social media platforms
- Search profiles with twitter handle
- Same look and feel on both iOS and android


Website: [getcurrent.io](https://getcurrent.io)

Community: [telegram group](https://t.me/+1NhSTfdwv1M2MTky)


In order to give a consistent user experience across mobile devices, we built it on React Native. Current will work in two modes: base and expert. We built the app with base mode features, which offers numerous features for new users right out of the box.

#### Base mode:
For normal users who are used to twitter/facebook like experience where the App manages their keys, lightning wallet, multimedia storage and automated relay management

#### Expert mode:
For power and technical users who are experienced in managing their keys, pay invoices using any lightning wallet and ability to add/manage their own relays.


## Features

Base mode features are currently built and available on the app.

#### Secure Key Management:
Current app utilizes Bitcoin’s BIP-39 seed words to create a human-readable backup for nostr keys. This helps users to store them securely on the device and easily backup on industry standard hardware wallets.

#### Lightning Wallet:
One of the best use cases we have seen of users using the Nostr client is to send and receive sats. However many users struggle with using separate lightning wallets to pay for invoices. So we built a lightning wallet inside the app with which users can send and receive sats with a click of a button.

#### Media storage management:
Over 80% of social media posts are with images and videos. Users will be able to upload images and later videos directly within the app and share their experiences with their community. Uploaded images are scanned for inappropriate content and rejected immediately.

#### Automated Relay management & Ability to add/remove relays:
App automatically scans and connects to appropriate relays suited for users to send and receive posts. Users do not need to pay for relays or manually configure them. However, there is also an option for advanced users to change relays

#### One address for NIP-05 and Lightning:
To make it easier for users, we let them choose a single verified address to send and receive messages and send and receive sats. We also have choices on domain names such as current.tips, current.fyi

#### Import your Twitter follows:
To provide the best user experience, users will be able to port their twitter followers when they set up their profile and right away join the conversations by scrolling through the feeds on their home feed. Users will also be able to search by Nostr public key or NIP-05 address or twitter handle to find new users to follow.

#### No Global view:
Global feed is overwhelmed by in-appropriate messages and unrelated messages which will not serve any purpose for the users. Instead, users will be able to have active conversations within their follower network and expand the network by adding new and interesting people they want to interact with.

#### One click Zaps

Easily share sats by pressing the zap button. You can preset the amount of zaps to be sent each time you press the button. Or long press to set a custom amount. It is that easy.

#### Wallet Connect

Enjoy 1-click zaps on other Nostr clients like snort.social or Amethyst with ease. Simply create a wallet connect link and paste it into the client. Plus, you can manage multiple wallet connect links in a fine-grained way by limiting the amount of SATS and setting an expiry date.

#### Wallet Home Screen Redesign

We've listened to your feedback and redesigned the wallet home screen to make it even easier to use.

#### Improved Search View

Searching for profiles and trending posts is now easier than ever with our major search screen overhaul.

#### Experimental Direct Messages (Alpha Version)

Enjoy end-to-end encrypted direct messaging with the ability to share images. This is our first version, so please report any bugs you encounter.

#### Push Notifications

Never miss a DM or zap again! Receive push notifications for DMs, likes, mentions, and reposts, even when you're away from your desk. No other Nostr client offers this feature directly from relays.


#### Already implemented NIPs

 - NIP-01: Basic protocol flow
 - NIP-02: Contact List and Petnames
 - NIP-04: Encrypted Direct Message
 - NIP-05: Mapping Nostr keys to DNS-based internet identifiers
 - NIP-06: Basic key derivation from mnemonic seed phrase
 - NIP-18: Reposts
 - NIP-19: bech32-encoded entities
 - NIP-25: Reactions
 - NIP-38: User statuses
 - NIP-47: Nostr Wallet connect
 - NIP-57: Lightning Zaps
 - NIP-58: Badges

#### To be implemented:

 - NIP-12: Generic tag queries (hashtags)
 - NIP-42: Authentication of clients to relays
 - NIP-94: File Metadata
 - NIP-69: Zap Polls



#### Expert Mode:



## Screenshots


![](https://i.current.fyi/current/app/currentAppv013-store.png)





## Roadmap

Our goal is to "Build a sustainable micro app economy of the future" on the Nostr protocol. Micro App developers will be able to directly build and provide services to end users. Once the base features of the app are stable, we will start to expand our micro economy. We can't wait to see what features will be built on it. Think of iMessage App extensions but super charged and supported by lightning payments.

Find the architecture we have in mind.



![](https://i.current.fyi/current/app/microapp2.png)





## Run Locally

Clone the project

```bash
  git clone https://github.com/starbackr-com/current
```

Go to the project directory

```bash
  cd current
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npx expo start
```


## App Store Links

App successfully went through appstore review and was approved by Apple.

iOS: https://apps.apple.com/us/app/current-nostr-bitcoin/id1668517032

Google play: https://play.google.com/store/apps/details?id=io.getcurrent.current

Android APK: https://i.current.fyi/help/Current+App+v0.1.3-Alajuela.apk

## Support

For support, email hello@getcurrent.io.

contact us on Nostr https://nostr.band/npub1current7ntwqmh2twlrtl2llequeks0zfh36v69x4d3wmckg427safsh3w


## Contributing

Contributions are always welcome!

We are looking for developers to start building these features. Please reach out before getting started

 - Zap Polls
 - Embed Audio/video events
 - NIP 94

 Please reach out to starbuilder@current.fyi on Nostr https://nostr.band/npub1mz3vx0ew9le6n48l9f2e8u745k0fzel6thksv0gwfxy3wanprcxq79mymx




## License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
