<?php


namespace app\models;

use Yii;
use yii\base\Model;

class IndexForm extends Model
{
    public $name;
    public $email;
    public $tel;
    public $text;
//    public $reCaptcha;

    public function rules()
    {
        return [
            [['name', 'email', 'tel', 'text'], 'required', 'message' => 'заполните это поле !'],
            ['email', 'email'],
            ['name', 'string', 'length' => [3, 30]],
            ['tel', 'string', 'length' => [11, 30]],
            ['text', 'string', 'length' => [3, 2000]],
            /*[['reCaptcha'], \himiklab\yii2\recaptcha\ReCaptchaValidator2::className(),
                'secret' => '6LftVL4ZAAAAAOY8dZHmrKkRnX1Di43yH0DIq34Z', // unnecessary if reСaptcha is already configured
                'uncheckedMessage' => 'Подтвердите, что вы не робот'],*/

            /*[['reCaptcha'], \himiklab\yii2\recaptcha\ReCaptchaValidator3::className(),
                'secret' => '6LfNdr4ZAAAAAA-JNIMCWXlx_eeYv-JxJzJpdPdz', // unnecessary if reСaptcha is already configured
                'threshold' => 0.5,
                'action' => 'index',
            ],*/

        ];
    }

    public function attributeLabels()
    {
        return [
            'reCaptcha' => '',
        ];
    }

    public function mailSend()
    {
        /* Отправка почты */
        $name = mb_ucfirst(clr_get($this->name));
        $email = clr_get($this->email);
        $tel = clr_get($this->tel);
        $text = clr_get($this->text);

        $subject = 'Письмо с сайта Alex-art';
        $body = 'Вам пишет <b style="font-size: 120%;text-shadow: 0 1px 0 #e61b05">' . $name . '</b><br>' . clr_get($email) . '<br>Tel: ' . $tel . '<br><br><div style="font-style: italic">' . nl2br(clr_get($text)) . '</div>' .
            '<br><br>Сообщение отправлено с сайта <b>https:' . Yii::$app->params['siteUrl'] . '</b>';

        $success = Yii::$app->mailer->compose()
            ->setTo(Yii::$app->params['email'])
            ->setFrom([Yii::$app->params['email'] => Yii::$app->params['siteUrl']])
            ->setReplyTo([$email => $name])
            ->setSubject($subject)
            ->setHtmlBody($body)
            ->send();

        return $success;
    }

}