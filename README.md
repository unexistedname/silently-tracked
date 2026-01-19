# A small personal project for tracking manga updates

Nothing more, that's it.

## **Features:**
- Tracking (scraping) using axios 
- Currently only supports rawkuma

## Usage:
1. Clone this repo,
2. Configure the base data:
Make sure you create a file called `baselink.json` inside the `data` folder which contain the title and the rawkuma link (the title doesn't have to be accurate, just call it whatever you want. It'll be used as an id)
Example:
```json
{
    "Jujutsu kaisen": "https://rawkuma.net/manga/jujutsu-kaisen/",
    "this is so me frfr": "https://rawkuma.net/manga/mayonaka-heart-tune/",
    etc...
}
```
3. Open a terminal inside the folder,
4. Run `npm install`
5. Run `npm run start`
6. You may notice new files called `chapter.json` and `data.json` have appeared in `data` folder. 
- `data.json` contains metadata for every tracked manga. Currently it's unused, but it'll be used for future app/gui.
- `chapter.json` contains the scraped chapters. It also has newChapter key which holds newly updated chapter. The chapter(s) will stay in newChapter until newer chapter is detected.

## **Future implementations:**
- [ ] Website GUI using React (or maybe just a regular software/mobile app if i have time)
- [ ] Tracks personal records and history (idk how to say it).
- [x] Replace Playwright with request-based scraping for optimization
- [ ] Interactive Discord bot features
- [ ] Support for tracking multiple websites
- [ ] Mirroring feature (basically same as the prev one)
    
---

## Disclaimer

This project is for **educational and personal use purposes only**. 

1. **No Affiliation:** This tool is not affiliated with, authorized, maintained, or sponsored by the website(s) it tracks.
2. **Content Ownership:** I do not host, upload, or own any of the content tracked by this script. All rights, titles, and interests in the content belong to their respective owners/original creators.
3. **Usage Responsibility:** The user assumes all responsibility for how they use this tool. The developer is not liable for any misuse, copyright infringement, or legal issues arising from the use of this software.
4. **No Warranties:** This program is provided "as is" without any warranties of any kind.
