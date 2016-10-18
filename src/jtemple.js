/* jtemple */

/*
* Author: Farhan Wazir
* Email: farhan.wazir@gmail.com
* Website: http://github.com/farhanwazir/jtemple
*
************ Objective ***********
* This piece of code is to achieve small task in few lines.
*
*
************ Description: ***********
* I was working on one project where i need javascript based template engine but unfortunately
* available open source template engines are not fulfilling my need but these are not for widgets
* or small pieces of html codes. Available engines good for use if you are start with them but not
* for developed applications.
*
*
************ LICENSE ***********
* The MIT License (MIT)
* Copyright (c) 2016 Farhan Wazir
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
* associated documentation files (the "Software"), to deal in the Software without restriction,
* including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
* The above copyright notice and this permission notice shall be included in all copies or substantial
* portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
* LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN
* NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* */

;(function($, window){

    var myName = 'jtemple';

    function jConstruct(ele, options){

        var config = $.extend({}, $.fn[myName].defaults, options);
        this.target = ele;

        var new_line = '\n';
        var quote_open = false,  statement_open = false;
        var output_var = 'jtemple_output';

        if(config.target !== false) this.target = $(config.target);

        var init = function(){

        };

        var readTmpl = function (){
            lines = $(config.template).html().split('\n');
            /* Define output variable first*/
            output = "var "+ output_var +"='';\n";
            $.each(lines, function(index, value){
                output += formatAsScript(value, index, lines.length);
            });
            output = replaceVars(output);
            return output;
        };

        var replaceVars = function (content){
            var $var_matches = /\{#[\s]*(.+\S)[\s]*#}/;
            if(content.match($var_matches) instanceof Array){
                content = content.replace(/{#/g, config.syntax.quote + '+').replace(/#}/g, '+' + config.syntax.quote);
            };
            return content;
        };

        var formatAsScript = function (line, index, total){
            var $statement_matches = [
                /(#for[\s]*\([\s]*)(.+\S)([\s]*\)[\s]*;)/,
                /(#foreach[\s]*\([\s]*)(.+\S)([\s]*\)[\s]*;)/,
                /(#if[\s]*\([\s]*)(.+\S)([\s]*\)[\s]*;)/,
            ];

            var $end_statement_matches = [
                /(#endfor[\s]*;)/,
                /(#endforeach[\s]*;)/,
                /(#endif[\s]*;)/,
            ];

            var $statement_replacement = [
                'for(#{statement}#){ \n',
                'foreach(#{statement}#){ \n',
                'if(#{statement}#){ \n',
            ];

            var $end_statement_replacement = '\n}\n';
            var quote_replacement = new RegExp(config.syntax.quote, "g");
            var output = $.trim(line).replace(quote_replacement, '\\"');
            for(var i = 0; i < $statement_matches.length; i++){
                var result = line.match( $statement_matches[i] );
                if(result instanceof Array){
                    if(quote_open){
                        output = config.syntax.quote +";";
                        quote_open = false;
                    }else{
                        output = "";
                    }
                    output += line.replace($statement_matches[i], $statement_replacement[i].replace( '#{statement}#', result[2].replace('&lt;', '<').replace('&gt;', '>') ) );
                    statement_open = true;
                    break;
                }
            }

            if(statement_open && !quote_open) {
                output += new_line + output_var + "+=" + config.syntax.quote;
                quote_open = true;
            }

            for(var i = 0; i < $end_statement_matches.length; i++){
                var result = line.match( $end_statement_matches[i] );
                if(result instanceof Array){
                    if(quote_open){
                        output = config.syntax.quote +";";
                        quote_open = false;
                    }else{
                        output = "";
                    }
                    output += line.replace($end_statement_matches[i], $end_statement_replacement );
                    statement_open = false;
                    break;
                }
            }

            if(index == total - 1){
                if(quote_open){
                    output += config.syntax.quote +";";
                    quote_open = false;
                }
                if(statement_open){
                    output += $end_statement_replacement;
                    statement_open = false;
                }
            }else if(!statement_open && !quote_open){
                output += output_var + "+=" + config.syntax.quote;
                quote_open = true;
            }

            return output;
        }

        var compile = function(data){
            this.data = data;
            $.globalEval(readTmpl());
            return window[output_var];
        };

        var publish = function (target){
            $(target).append(compile(config.data));
        };

        publish(this.target);

        return this;
    };

    $.fn[myName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + myName)) {
                $.data(this, 'plugin_' + myName,
                    new jConstruct(this, options));
            }
        });
    };

    $.fn[myName].defaults = {
        template : 'tmpl', /**TODO: tmpl will needs to get from template files also, right now it is ID based**/
        /*server : false,*/ /**TODO: dynamic data call from server via AJAX**/
        data : [],
        syntax : {
            quote : '"'
            /*variable : {TODO: syntax will be customizable
             start : '{#',
             end : '#}'
             },
             statement : {
             start : '#',
             end : ';'
             }*/
        },
        target : false, //target element, where to publish
        publish : 'append', //here are 4 types (replace, append, appendBefore, appendAfter), append and appendAfter are same

        //events
        /*loaded : function(){}, //when template is loaded TODO: events needs to added for callbacks
         dataReceived : function(){},
         complete : function(){},
         error : function(){}*/

    };
}(jQuery, window));
