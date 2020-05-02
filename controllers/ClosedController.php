<?php

namespace app\controllers;
use yii\web\Controller;

class ClosedController  extends Controller
{
    public function actionIndex()
    {
        return $this->renderFile('@app/views/layouts/closed.php');
    }
}