<?php

namespace app\models;

use Yii;
use yii\base\Model;

/**
 * LoginForm is the model behind the login form.
 *
 * @property User|null $user This property is read-only.
 *
 */
class LoginForm extends Model
{
    public $username;
    public $password;
    public $rememberMe = false;
//    public $reCaptcha;

    private $_user = false;

    /**
     * @return array the validation rules.
     */
    public function rules()
    {
        return [
            // username and password are both required
            [['username', 'password'], 'required', 'message' => 'заполните это поле !'],
            // rememberMe must be a boolean value
            ['rememberMe', 'boolean'],
            // password is validated by validatePassword()
            ['password', 'validatePassword'],
            // verifyCode needs to be entered correctly
//            ['verifyCode', 'captcha'],
            //reCaptcha v2
            /*[['reCaptcha'], \himiklab\yii2\recaptcha\ReCaptchaValidator2::className(),
                'secret' => '6LftVL4ZAAAAAOY8dZHmrKkRnX1Di43yH0DIq34Z', // unnecessary if reСaptcha is already configured
                'uncheckedMessage' => 'Подтвердите, что вы не робот'],*/

            //reCaptcha v3
            /*[['reCaptcha'], \himiklab\yii2\recaptcha\ReCaptchaValidator3::className(),
                'secret' => '6LfNdr4ZAAAAAA-JNIMCWXlx_eeYv-JxJzJpdPdz', // unnecessary if reСaptcha is already configured
                'threshold' => 0.5,
                'action' => 'login',
            ],*/
        ];
    }

    public function attributeLabels()
    {
        return [
            'username' => 'Логин',
            'password' => 'Пароль',
            'rememberMe' => 'Запомнить меня',
//            'verifyCode' => 'Введите код',
            'reCaptcha' => '',
        ];
    }

    /**
     * Validates the password.
     * This method serves as the inline validation for password.
     *
     * @param string $attribute the attribute currently being validated
     * @param array $params the additional name-value pairs given in the rule
     */
    public function validatePassword($attribute, $params)
    {
        if (!$this->hasErrors()) {
            $user = $this->getUser();

            if (!$user || !$user->validatePassword($this->password)) {
                $this->addError($attribute, 'Неверные логин/пароль');
            }
        }
    }

    /**
     * Logs in a user using the provided username and password.
     * @return bool whether the user is logged in successfully
     */
    //         15552000 - 180 суток
    public function login()
    {
        if ($this->validate()) {
            if ($this->rememberMe) {
                $u = $this->getUser();
                $u->generateAuthKey();
                $u->save();
            }
            return Yii::$app->user->login($this->getUser(), $this->rememberMe ? 15552000 : 0);
        }
        return false;
    }

    /**
     * Finds user by [[username]]
     *
     * @return User|null
     */
    public function getUser()
    {
        if ($this->_user === false) {
            $this->_user = User::findByUsername($this->username);
        }

        return $this->_user;
    }
}
