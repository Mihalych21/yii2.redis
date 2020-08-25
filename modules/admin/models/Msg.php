<?php


namespace app\modules\admin\models;


use yii\base\Model;
use app\models\Post;
use app\models\Callback;

class Msg extends Model
{
    /* Кол-во новых сообщения */
    public static function getNewMsgCount()
    {
        $newPostCount = Post::find()->where(['is_read' => '0'])->count(); // кол-во писем
        $newPostCount = $newPostCount ? $newPostCount : 0;

        $newCallCount = Callback::find()->where(['is_read' => '0'])->count(); // кол-во заявок на обр. звонок
        $newCallCount = $newCallCount ? $newCallCount : 0;
        return [
            'newPostCount' => $newPostCount,
            'newCallCount' => $newCallCount
        ];
    }

    /* Кол-во всех сообщений */
    public static function getAllMsgCount()
    {
        $allPostCount = Post::find()->count(); // кол-во писем
        $allPostCount = $allPostCount ? $allPostCount : 0;

        $allCallCount = Callback::find()->count(); // кол-во заявок на обр. звонок
        $allCallCount = $allCallCount ? $allCallCount : 0;
        return [
            'allPostCount' => $allPostCount,
            'allCallCount' => $allCallCount
        ];
    }

    /* Пометить все письма прочитанными */
    public static function setPostAllRead()
    {
        $save = true;
        $arr = Post::find()->where(['is_read' => '0'])->all();

        foreach ($arr as $item){
            $item->is_read = 1;
            $res = $item->save();
            $save = ($save && $res) ? true : false;
        }
        $result = $save;
        return $result;
    }

    /* Пометить все заказы обратных звонков прочитанными */
    public static function setZvonokAllRead()
    {
        $save = true;
        $arr = Callback::find()->where(['is_read' => '0'])->all();

        foreach ($arr as $item){
            $item->is_read = 1;
            $res = $item->save();
            $save = ($save && $res) ? true : false;
        }
        $result = $save;
        return $result;
    }
}