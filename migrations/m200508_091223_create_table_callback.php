<?php

use yii\db\Migration;

/**
 * Handles the creation for table `{{%callback}}`.
 */
class m200508_091223_create_table_callback extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->createTable('{{%callback}}', [

            'id' => $this->primaryKey()->unsigned()->notNull(),
            'name' => $this->string(100)->notNull(),
            'tel' => $this->string(30)->notNull(),
            'date' => $this->timestamp()->notNull()->defaultValue(CURRENT_TIMESTAMP),

        ]);
     }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        $this->dropTable('{{%callback}}');
    }
}
