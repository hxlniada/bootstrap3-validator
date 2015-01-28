$.fn.extend({
	validator: function(options) {
		var checkGroup = [];
		this.find('[data-validation]').each(function() {
			var $inputGroup = $(this),
				validation = $inputGroup.data('validation'),
				target = $inputGroup.data('target'),
				$element = $inputGroup.find('[name=' + target + ']');
			
			if ($element.prop('disabled') || $element.prop('readonly')) {
				return;
			}

			$element.on('change blur', function() {
				$.validator.checkValid(this, validation, $inputGroup);
			});

			checkGroup.push({
				inputGroup: $inputGroup,
				element: $element,
				validation: validation
			});
		});

		this.data('checkGroup', checkGroup);
	},
	checkValid: function() {
		var checkGroup = this.data('checkGroup'),
			validateResult,
			firstInvalid;

		for (var i = 0; i < checkGroup.length; i++) {
			validateResult = $.validator.checkValid(checkGroup[i].element, checkGroup[i].validation, checkGroup[i].inputGroup, true);
			
			if (!validateResult && (typeof firstInvalid === 'undefined')) {
				firstInvalid = i;
			}
		}

		if (typeof firstInvalid === 'number') {
			checkGroup[firstInvalid].element.focus();
			return false;
		} else {
			return true;
		}
	}
});

$.extend({
	validator: {
		validRender: function($element, $inputGroup) {
			$inputGroup.removeClass('has-error').addClass('has-success').find('.help-block').text('');
		},
		invalidRender: function($element, $inputGroup, message) {
			$inputGroup.removeClass('has-success').addClass('has-error').find('.help-block').text(message);
		},
		remoteHanlder: function(value, data, $element, $inputGroup) {//远程校验比较特殊
			if (data === -1) {
				$element.data('remote', 'error');
				$.validator.invalidRender($element, $inputGroup, $.validator.messages.remote.error);
				return;
			}

			if (data === false || data.msg === 'valid_success') {
				$element.data('remote', 'success');
				$.validator.validRender($element, $inputGroup);
				return;
			} else {
				$element.data('invalids', $element.data('invalids').concat(value));
				$element.data('remote', 'fail');
				$.validator.invalidRender($element, $inputGroup, $.validator.messages.remote.fail);
			}
		},
		rules: {
			remote: function(value, url, $element, $inputGroup, check) {
				if ($.validator.hasValue($element.data('invalids') || [], value)) {
					$.validator.remoteHanlder.call(this, value, false, $element, $inputGroup);
					return $.validator.messages.remote.pending;
				}

				if (check) {
					return true;
				}

				var data = {};
				
				data[$element.attr('name')] = value;

				$.get(url, $.extend(data, {_: +new Date()}), null, 'json')
					.done(function(data) {
						$.validator.remoteHanlder.call(this, value, data, $element, $inputGroup);
					})
					.fail(function() {
						$.validator.remoteHanlder.call(this, value, -1, $element, $inputGroup);
					});

				$element.data('remote', 'pending');

				return $.validator.messages.remote.pending;
			},
			required: function(value) {
				return !!value.length ? true : $.validator.messages['required'];
			},
			mobile: function(value) {
				return /^1[1-9]\d{9}$/.test(value) ? true : $.validator.messages['mobile'];
			},
			email: function(value) {
				return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value) ? true: $.validator.messages['email'];
			}
		},
		messages: {
			remote: {
				pending: '数据远程验证中……',
				error: '数据发送失败',
				fail: '该数据不合法'
			},
			required: '此处不能为空',
			mobile: '不是合法的手机号码',
			email: '不是合法的邮箱格式'
		},
		//check表示是否是主动检测
		checkValid: function(element, validation, $inputGroup, check) {
			var $element = $(element),
				value = $.trim($element.val()),
				i, ruleName, params, invalidValues, message,
				rules = validation.split('|');

			//如果检测到非法数据中存在该数据，就不需要再检测了
			invalidValues = $element.data('invalids') || [];

			if ($element.data('remote') === 'pending') {
				return false;
			}

			for (i = 0; i < rules.length; i++) {
				ruleName = rules[i].split('::')[0];
				params = rules[i].split('::')[1];

				//获取检测后的结果
				message = $.validator.rules[ruleName](value, params, $element, $inputGroup, check);
				
				if (typeof message === 'string') {
					if (ruleName !== 'remote') {
						invalidValues.push(value);
					}
					$element.data('invalids', invalidValues);
					$.validator.invalidRender($element, $inputGroup, message);
					return false;
				}
			}
			$.validator.validRender($element, $inputGroup);
			return true;
		},
		hasValue: function(arr, value) {
			if (Array.prototype.indexOf) {
				return !!~arr.indexOf(value);
			}

			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == value) {
					return true;
				}
			}

			return false;
		}
	}
});