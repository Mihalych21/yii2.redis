<?php


namespace app\modules\admin\controllers;

use app\models\Post;
use app\models\Callback;
use yii\web\Controller;
use app\modules\admin\models\Msg;

class AppAdminController extends Controller
{
    public function beforeAction($action)
    {
        // * Количество новых(не помеченных как прочитанные) сообщений
// * (boolean поле "is_read" в таблицах post и callback в ответе за это)
        $arr = Msg::getNewMsgCount();
        $_SESSION['newPostCount'] = $arr['newPostCount'];
        $_SESSION['newCallCount'] = $arr['newCallCount'];

// * Количество всех сообщений
        $arr = Msg::getAllMsgCount();

        $_SESSION['allPostCount'] = $arr['allPostCount'];
        $_SESSION['allCallCount'] = $arr['allCallCount'];

        return parent::beforeAction($action); // TODO: Change the autogenerated stub
    }
}