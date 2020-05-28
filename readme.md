# WP XML Parse

Warning, this repo is in substantial alpha phase. Clone and use at your own risk!

Simple Steps:

1. Download your complete wordpress archive xml file.
2. Add xml file to `/data` as `data.xml`
3. Run `npm run parse` - this will create a paired down json file to work with (faster for debugging later on.)
4. `npm run once` will run the script a single time for parsing the content. `npm run dev` will run the script in "watch mode" to check for changes.

Note:
There are a number of helpers I've left in for the purpose of checking for custom post types and other behaviour. They were unique to my use-case but can be adapted to your needs with little effort.

I would LOVE your feedback to develop this into a more generically applicable tool.
