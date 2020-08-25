<?php

namespace app\modules\admin\models;

use Yii;

/**
 * This is the model class for table "content".
 *
 * @property integer $id
 * @property string $page
 * @property string $page_text
 * @property string $title
 * @property string $description
 * @property integer $last_mod
 */
class Content extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'content';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['page', 'page_text', 'title'], 'required'],
            [['page_text'], 'string'],
            [['last_mod'], 'integer'],
            [['page'], 'string', 'max' => 50],
            [['title', 'description'], 'string', 'max' => 500],
            [['page'], 'unique'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'page' => 'Страница(поле page)',
            'page_text' => 'Содержимое страницы(поле page_text)',
            'title' => 'Title',
            'description' => 'Мета тег Description',
            'last_mod' => 'Unix TimeStamp для заголовка LastModified',
        ];
    }
}