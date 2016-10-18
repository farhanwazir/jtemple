# jtemple
jtemple is a template engine, to achieve small tasks in few lines. No technical programming knowledge require to use it. If you are using html and jquery then don't hasitate it to use. jtemple will save your a lot of time and do many small tasks for you.

### Dependencies
 > JQuery
 
### Options
 > data : {JSON}
 
 > template : {Tag id which contains your template code}
 
 > target : {Tag id where you want this template to be published}
 
### Usage

Include in your project
```javascript
<script src="dist/jtemple.min.js" type="text/javascript"></script>
```

**Syntax**
jtemple syntax is very simple as described below:
"#" hash sign is indication of statement start and ";" semicolon sign is use for end line. Principle of scripting is must close opened statement, with jtemple you can close statement with #end{statement};. 
You don't need to use #; signs except statements. 

Currently jtemple only supports for #for(); and #if(); condition as illustrated below.

**#for();**
```javascript
<div class="row">
    #for(var z=0; z < data.length; z++);
        <div class="col-md-3">
        ....... Your code here
        </div>
    #endfor;
</div>
```

**#if();**
```javascript
#if(data.length > 0);
    <div class="row">
        <div class="col-md-3">
        ....... Your code here
        </div>
    </div>
#endif;
</div>
```

**{#data.variable#}**
For print JSON value in your template "data" is main container of your JSON data. So, use it like below illustration
```javascript
<div class="row">
    <div class="col-md-3">
    {#data.name#}, {#data.age#}, {#data.gender#} and so on....
    </div>
</div>
</div>
```

### Example
```javascript
<div class="example-container">
    #for(var z=0; z < data.length; z++);
        <div class="row">
            #for(var y=0; y < data[z].length; y++);
                <div class="col-md-3">
                    <input type="radio" name="category" value="{#data[z][y][\'id\']#}" id="category-{#data[z][y].id#}">
                    <label for="category-{#data[z][y].id#}">
                        <img src="{#data[z][y].icon#}" alt="{#data[z][y].title#}" />
                        <span class="title">{#data[z][y].title#}</span>
                    </label>
                </div>
            #endif;
        </div>
    #endfor;
</div>
```

## Future release
I'll add many more features like foreach loop, if else conditions and many i'll share you all.

Contributors are welcome. 
