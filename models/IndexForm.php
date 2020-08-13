<?php


namespace app\models;

use Yii;
use yii\base\Model;

class IndexForm extends Model
{
    public $name;
    public $email;
    public $tel;
    public $test;
    public $text;
    public $reCaptcha;

    public function rules()
    {
        return [
            [['name', 'email', 'tel'], 'required', 'message' => 'заполните это поле !'],
            ['email', 'email'],
            ['name', 'string', 'length' => [3, 30]],
            ['tel', 'string', 'length' => [11, 30]],
            ['text', 'string', 'length' => [3, 2000]],
            [['reCaptcha'], \himiklab\yii2\recaptcha\ReCaptchaValidator2::className(),
                'secret' => '6LftVL4ZAAAAAOY8dZHmrKkRnX1Di43yH0DIq34Z', // unnecessary if reСaptcha is already configured
                'uncheckedMessage' => 'Подтвердите, что вы не робот'],

            /*[['reCaptcha'], \himiklab\yii2\recaptcha\ReCaptchaValidator3::className(),
                'secret' => '6Ld6d7sZAAAAAOaxD_t_a-VY3rMyTzzQdHkpSuF_', // unnecessary if reСaptcha is already configured
                'threshold' => 2,
                'action' => '/mail_ok',
            ],*/

        ];
    }

    public function attributeLabels()
    {
        return [
            'reCaptcha' => '',
        ];
    }

}