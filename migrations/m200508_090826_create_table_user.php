<?php

use yii\db\Migration;

/**
 * Handles the creation for table `{{%user}}`.
 */
class m200508_090826_create_table_user extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->createTable('{{%user}}', [

            'id' => $this->primaryKey()->unsigned()->notNull(),
            'username' => $this->string(30)->notNull(),
            'password' => $this->string(255)->notNull(),
            'auth_key' => $this->string(255),

        ]);
     }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        $this->dropTable('{{%user}}');
    }
}
