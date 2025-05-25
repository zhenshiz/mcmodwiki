# How to Provide Your Translation
Open the `src/assets/translatable` folder, where all the localization files are located under the lang folder. The file names should follow the naming conventions used within the Minecraft mod. Then, provide the corresponding translations for each key in the JSON files. Finally, open the `translatable.js` file, and add the corresponding enum in language.enum. Add your translated files to onlyLang (this step can also be handled by the author; you only need to provide the translation).

# How to Add a Wiki MarkDown File
You can generate the markdown file using the website's built-in markdown editor. The website will automatically fill in the file name, and you can then add it to the `src/assets/mod/md/mod_name` folder. Finally, add the mod information in `mod.js`.

If you must use your own markdown file, make sure to check the following:

Does your markdown support the display format used by this project?
Does your file name comply with the naming convention? The standard format is `${mc_version}_${mod_loader}_${mod_version}_${language}.md`.