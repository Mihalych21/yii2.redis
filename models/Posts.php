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
class Posts extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'posts';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['name', 'email', 'tel', 'body'], 'required'],
            [['body'], 'string'],
            [['date'], 'safe'],
            [['name'], 'string', 'max' => 100],
            [['email'], 'string', 'max' => 255],
            [['tel'], 'string', 'max' => 20],
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

    public function mailSend($name, $email, $tel, $msg)
    {
        /* Отправка почты */
        $subject = 'Письмо с сайта Alex-art';
        $body = 'Вам пишет <b style="font-size: 120%;text-shadow: 0 1px 0 #e61b05">' . $name . '</b><br>' . clr_get($email) . '<br>Tel: ' . $tel . '<br><br><div style="font-style: italic">' . nl2br(clr_get($msg)) . '</div>' .
            '<br><br>Сообщение отправлено с сайта <b>https://alexart21.ru</b>';

        $success = Yii::$app->mailer->compose()// Yii::$app->params['adminEmail'] [clr_get($this->email) => $name]
        ->setTo('mail@alexart21.ru')
            ->setFrom(['mail@alexart21.ru' => 'alexart21.ru'])
            ->setReplyTo([$email => $name])
            ->setSubject($subject)
            ->setHtmlBody($body)
            ->send();

        /* Запись в БД */
        $this->name = $name;
        $this->email = $email;
        $this->tel = $tel;
        $this->body = $msg;

        $this->save();

        return $success;
    }
}
