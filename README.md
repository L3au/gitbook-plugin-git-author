# gitbook-plugin-git-author

This is a plugin for automatically adding author and timestamp to each gitbook article, including creator and last modified user from git commits

## Example

`README.md` file

Be sure to commit this file to git repository

```markdown
# Title of the Article

content
```

### Output

```html
<h1>Title of the Article</h1>

<p>content</p>

<div class="git-author-container">
    <div class="modified">Last modified by someone 2016-06-06 06:06:06</div>
    <div class="created">Created by someone 2016-06-06 06:06:06</div>
</div>
```

## Usage

### install

```sh
npm i -D gitbook-plugin-git-author
```

### book.json

```js
{
    "plugins": ["git-author"]
    "pluginsConfig": {
          "git-author":{
              "modifyTpl": "Last modified by {user} {timeStamp}",
              "createTpl": "Created by {user} {timeStamp}",
              "timeStampFormat": "YYYY-MM-DD HH:mm:ss"
          }
    }
}
```

## hide creator

```
"createTpl": false
```

## custom styles

`book.json`

```js
{
    "styles": {
        "website": "./website.css"
    }
}
```

`website.css`

```
.git-author-container {
    font-size: 85%;
}
```


