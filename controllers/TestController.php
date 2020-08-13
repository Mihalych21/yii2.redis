<?php

namespace app\controllers;

use app\models\TestForm;
use yii\web\Controller;

class TestController extends Controller
{
    public $layout = 'test';

    public function actionIndex()
    {
        $model = new TestForm();
        return $this->render( 'index', [
            'model' => $model,
        ]);
    }
}
