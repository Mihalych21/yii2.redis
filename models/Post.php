<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "post".
 *
 * @property string $id
 * @property string $name
 * @property string $email
 * @property string $tel
 * @property string $body
 * @property string $date
 */
class Post extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'post';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['name', 'email',  'body'], 'required'],
            [['body'], 'string'],
            [['date'], 'safe'],
            [['name'], 'string', 'max' => 100],
            [['email'], 'string', 'max' => 255],
            [['tel'], 'string', 'max' => 30],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'email' => 'Email',
            'tel' => 'Tel',
            'body' => 'Body',
            'date' => 'Date',
        ];
    }

    public function mailSend($name, $email, $tel, $text)
    {
        /* Отправка почты */
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

        /* Запись в БД */
         $this->name = $name;
         $this->email = $email;
         $this->tel = $tel;
         $this->body = $text;

         $this->save();

        return $success;
    }
}