<?php

use yii\db\Migration;

/**
 * Handles the creation for table `{{%content}}`.
 */
class m200508_091314_create_table_content extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->createTable('{{%content}}', [

            'id' => $this->primaryKey()->unsigned()->notNull(),
            'page' => $this->string(255)->notNull(),
            'page_text' => $this->text()->notNull(),
            'title' => $this->string(255)->notNull(),
            'keywords' => $this->string(255),
            'description' => $this->string(255),
            'last_mod' => $this->integer(10)->unsigned()->notNull(),

        ]);
     }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        $this->dropTable('{{%content}}');
    }
}
