# How to Contribute Translations

Open the `src/languages/messages` folder; all language files are located here. For example, `zh-CN.mjs` is the Chinese language file, and `en-US.mjs` is the English language file. You can simply provide the translated `.mjs` file, and I can help place it in the correct location and provide the corresponding language configuration.

However, if you prefer to submit a Pull Request (PR) and set up all the configurations yourself, you are certainly welcome to do so:

1. In `src/assets/info/web.js`, find the `languageList` object. You can add your language type here. The `key` should be the language code, and the `value` should be the display name of the language.
2. Add your corresponding language `.mjs` file to the `src/languages/messages` folder.
3. In the `src/languages/index.js` file, find the `messages` property. Configure your language code and link it to the corresponding language file within this property.

# How to Contribute Translations for Mod Documentation

You can find the documentation for specific mods in the directory `public/md/ModName/Language`. You can copy the content of the documentation into the rich text editor on this website to edit it. Once edited, export it as a `.md` file and place it in the folder corresponding to the target language. This will allow the website to display the documentation in other languages.

**PS:** If you do not configure your language in `src/assets/info/web.js`, the website will be unable to switch to the documentation in your language. Therefore, please ensure this configuration is present. It is also highly recommended to provide the corresponding `.mjs` translation file for the interface as well.