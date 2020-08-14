<?php
/**
 * Created by PhpStorm.
 * User: Alex
 * Date: 19.08.2018
 * Time: 13:41
 */

namespace app\models;

use Yii;
use yii\base\Model;


class callForm extends Model
{
    public $name;
    public $tel;
//    public $reCaptcha;

    public function rules()
    {
        return [
            // name, email, subject and body are required
            [['name', 'tel'], 'required', 'message' => 'заполните это поле !'],
            ['name', 'string', 'length' => [3, 30]],
            ['tel', 'string', 'length' => [11, 30]],
            /*[['reCaptcha'], \himiklab\yii2\recaptcha\ReCaptchaValidator2::className(),
                'secret' => '6LftVL4ZAAAAAOY8dZHmrKkRnX1Di43yH0DIq34Z', // unnecessary if reСaptcha is already configured
                'uncheckedMessage' => 'Подтвердите, что вы не робот'],*/

            //reCaptcha v3
            /*[['reCaptcha'], \himiklab\yii2\recaptcha\ReCaptchaValidator3::className(),
                'secret' => '6LfNdr4ZAAAAAA-JNIMCWXlx_eeYv-JxJzJpdPdz', // unnecessary if reСaptcha is already configured
                'threshold' => 0.5,
                'action' => 'call',
            ],*/
        ];
    }


    /**
     * @return array customized attribute labels
     */
    public function attributeLabels()
    {
        return [
            'name' => 'Ваше Имя',
            'tel' => 'Номер телефона',
            'reCaptcha' => '',
        ];
    }


    public function callSend()
    {
//        debug($this->tel);die;
        $subject = 'Просьба перезвонить';
        $name = clr_get(mb_ucfirst($this->name));
        $tel = clr_get($this->tel);

        $body = 'Клиент &nbsp;<b style="font-size: 120%;text-shadow: 0 1px 0 #e61b05">' . $name . '</b>&nbsp; просит перезвонить.<br>' .
            'Тел. :&nbsp;&nbsp;<b style="font-size: 110%;>' . $tel . '</b>' .
            '<br><br>Сообщение отправлено с сайта <b>https://' . Yii::$app->params['siteUrl'] . '</b>';

        $success = Yii::$app->mailer->compose()
            ->setTo(Yii::$app->params['email'])
            ->setFrom([Yii::$app->params['email'] => Yii::$app->params['siteUrl']])
            ->setSubject($subject)
            ->setHtmlBody($body)
            ->send();

        if ($success) {
            if ($this->validate()) {
                return('<h3 style="color:green">Спасибо, ' . $name . ', Мы Вам обязательно перезвоним</h3>');
            }
        } else
            return('<h3 style="color:red">Ошибка !</h3>');
    }
}