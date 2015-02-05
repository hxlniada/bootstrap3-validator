# bootstrap3-validator
一个专门适配bootstrap3的表单验证组件

##为什么要做这样的插件
+ 单一好用的api 
```
data-validation="required|email|..."
```
+ 支持远程验证
```
data-validation="required|remote::url"
```
+ 很好的扩展性
```
$.validator.extend({
	rules: {
		ruleName: ruleHanlder
	},
	messages: {
		ruleName: ruleMessage
	}
});
```
##使用方法
> 首先，该插件暂时只支持form-group验证
> 其次，验证信息要写在form-group上，而不是input/select...这些表单元素上
> 再次，data-target指向验证的input/select...
```
<form><!--wrapper-->
    <div class="form-group" data-validation="required|remote::xxx" data-target="userId">
        <label for="userId" class="col-xs-3 control-label">百度账号：</label>
		<div class="col-xs-8">
			<input type="text" name="userId" class="form-control" />
			<div class="help-block"></div><!--必须，用来显示错误信息-->
		</div>
    </div>
</form>
```
##Api文档



##实例 
+ 下载jquery,bootstrap3和这个插件，放到页面
```
<form class="form-horizontal" role="form">
	<div class="form-group" data-validation="required|remote::xxx" data-target="userId">
		<label for="userId" class="col-xs-3 control-label">百度账号：</label>
		<div class="col-xs-8">
			<input type="text" name="userId" class="form-control" id="userId" />
			<div class="help-block"></div>
		</div>
	</div>
	<div class="form-group" data-validation="required" data-target="userName">
		<label for="userName" class="col-xs-3 control-label">广告主名称：</label>
		<div class="col-xs-8">
			<input type="text" class="form-control" id="userName" name="userName" placeholder="广告主名称" />
			<div class="help-block"></div>
		</div>
	</div>
</form>
```
