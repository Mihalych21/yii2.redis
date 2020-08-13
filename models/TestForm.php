<?php
namespace app\models;

use Yii;
use yii\base\Model;

class TestForm extends Model
{

    public $name;
    public $reCaptcha;

    public function rules()
    {
        return [
            [['name'], 'required', 'message' => 'заполните это поле !'],

            [['reCaptcha'], \himiklab\yii2\recaptcha\ReCaptchaValidator3::className(),
                'secret' => '6Ld6d7sZAAAAAOaxD_t_a-VY3rMyTzzQdHkpSuF_', // unnecessary if reСaptcha is already configured
                'threshold' => 0.5,
                'action' => '/test/index',
            ],
        ];
    }

}