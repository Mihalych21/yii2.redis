<?php
/**
 * Created by PhpStorm.
 * User: Alex
 * Date: 19.01.2017
 * Time: 15:43
 */

namespace app\modules\admin\controllers;

use Yii;
use yii\web\Controller;
use yii\filters\AccessControl;


class AppAdminController extends Controller
{

    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'rules' => [
                    [
                        'allow' => true,
                        'roles' => ['@'], // для авторизованных (в нашем сл. для админа)
                    ]
                ],
            ],
        ];
    }

    /* Если юзер есть но он не админ то останавливаем */
    /*protected function stop()
    {
        if ((Yii::$app->user->identity->username) && (strtolower(Yii::$app->user->identity->username) !== Yii::$app->params['admin'])) {
            throw  new \yii\web\HttpException (404,
                'Страница не существует или удалена');
//            Yii::$app->response->statusCode = 403;
//            die('<h1 style="font-weight: bold;font-size: 300%;text-align: center;text-shadow: 2px 2px red">НЕФИГ ТУТ ДЕЛАТЬ !!!</h1>');
        }
    }*/

}