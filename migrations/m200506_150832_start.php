<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m200506_150832_start
 */
class m200506_150832_start extends Migration
{


    // Use up()/down() to run migration code without a transaction.
    public function up()
    {
        $this->createTable('content', [
            'id' => $this->bigPrimaryKey()->unsigned(),
            'page' => $this->string(255)->unique()->notNull(),
            'page_text' => $this->text()->notNull(),
            'title' => $this->string(255)->notNull(),
            'keywords' => $this->string(255)->defaultValue(NULL),
            'description' => $this->string(255)->defaultValue(NULL),
            'last_mod' => $this->integer(),
        ]);

        $this->createIndex([
            'page'
        ]);



        $this->createTable('user', [
            'id' => $this->primaryKey()->unsigned(),
            'username' => $this->string(255)->notNull(),
            'password' => $this->string(255)->notNull(),
            'auth_key' => $this->string(255)->defaultValue(NULL),
        ]);

        $this->createTable('posts', [
            'id' => $this->bigPrimaryKey()->unsigned(),
            'name' => $this->string(100),
            'email' => $this->string(255),
            'tel' => $this->string(20),
            'body' => $this->text()->notNull(),
            'date' => $this->timestamp()->defaultValue('CURRENT_TIMESTAMP'),
        ]);

        $this->createTable('callback', [
            'id' => $this->bigPrimaryKey()->unsigned(),
            'name' => $this->string(100),
            'tel' => $this->string(20),
            'date' => $this->timestamp()->defaultValue('CURRENT_TIMESTAMP'),
        ]);
    }

    public function down()
    {
        $this->dropTable('content');
        $this->dropTable('user');
        $this->dropTable('posts');
        $this->dropTable('callback');
        return false;
    }

}
