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
            'id' => 'id',
            'name' => 'Имя',
            'email' => 'Email',
            'tel' => 'Teл.',
            'body' => 'Текст',
            'date' => 'Дата',
        ];
    }

    /* Запись в БД */
    public function dbSave($indexForm)
    {
        $name = mb_ucfirst(clr_get($indexForm->name));
        $email = clr_get($indexForm->email);
        $tel = clr_get($indexForm->tel);
        $text = clr_get($indexForm->text);

        $this->name = $name;
        $this->email = $email;
        $this->tel = $tel;
        $this->body = $text;

        $res = $this->save();
        return $res;
    }
}