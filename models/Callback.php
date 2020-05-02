<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "callback".
 *
 * @property int $id
 * @property string $name
 * @property string $tel
 * @property string $date
 */
class Callback extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'callback';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['name', 'tel'], 'required'],
            [['date'], 'safe'],
            [['name'], 'string', 'max' => 100],
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
            'name' => 'Имя',
            'tel' => 'Тел.',
            'date' => 'Дата',
        ];
    }

    public function callSend($name, $tel)
    {

        $subject = 'Обратный звонок';

        $body = 'Клиент &nbsp;<b style="font-size: 120%;text-shadow: 0 1px 0 #e61b05">' . $name . '</b>&nbsp; просит перезвонить.<br>' .
            'Тел. :&nbsp;&nbsp;<b style="font-size: 110%;>' . $tel . '</b>';

        $success = Yii::$app->mailer->compose()
            ->setTo('mail@alexart21.ru')
            ->setFrom(['mail@alexart21.ru' => 'alexart21.ru'])
            ->setSubject($subject)
            ->setHtmlBody($body)
            ->send();

        /* Запись в БД */
        if ($success) {// все хорошо
            // пишем данные в базу
            $this->name = $name;
            $this->tel = $tel;

            $this->save();

            $msg = '<h3 stytelolor:green;text-align: center">Спасибо,'. $name .'  ожидайте звонка!</h3>';
        } else{
            // что-то не так
            $msg = '<h3 style="color:red;text-align: center">Ошибка !</h3>';
        }

        return $msg;
    }
}
