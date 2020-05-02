<?php

namespace app\modules\admin\controllers;

use Yii;
use app\modules\admin\models\Content;
use app\modules\admin\models\ContentSearch;
//use app\modules\admin\models\Seo;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;

/**
 * ContentController implements the CRUD actions for Content model.
 */
class ContentController extends AppAdminController
{

    /**
     * Lists all Content models.
     * @return mixed
     */

    public function beforeAction($action)
    {
        if ($action->id == 'update') {
            $this->enableCsrfValidation = false;
        }
        return parent::beforeAction($action);
    }

    public function actionIndex()
    {
        $searchModel = new ContentSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single Content model.
     * @param integer $id
     * @return mixed
     */
    public function actionView($id)
    {
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }

    /**
     * Creates a new Content model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new Content();

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        } else {
            return $this->render('create', [
                'model' => $model,
            ]);
        }
    }

    public function actionUpdate($id, $contenteditable = '')
    {

        $model = $this->findModel($id);
        /* Режим contenteditable */
        if ($contenteditable == 1) {
            $this->layout = 'contenteditable';
            if (Yii::$app->request->isAjax) {
                $model->page_text = $_POST['page_text'];
                if ($model->save()) {
                    self::lastMod($id); // пишем Last Modified текущее время
                    Yii::$app->cache->flush(); // очистка кэша
                    $msg = '<h1 class="h1-alert">Успешно !</h1>';
                } else {
                    $msg = '<h1 class="h1-alert">Ошибка !</h1>';
                }
                return $this->render('alert', ['msg' => $msg]);
            }
//            die('HERE');
            return $this->render('contenteditable', ['model' => $model]);
        }


        /* Обычный режим */
        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            self::lastMod($id); // пишем Last Modified текущее время
            Yii::$app->cache->flush(); // очистка кэша
            return $this->redirect(['view', 'id' => $model->id]);
        } else {
            return $this->render('update', [
                'model' => $model,
            ]);
        }

    }

    /**
     * Deletes an existing Content model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();
//        Yii::$app->cache->flush(); // очистка кэша
        return $this->redirect(['index']);
    }

    /**
     * Finds the Content model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Content the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    private function findModel($id)
    {
        if (($model = Content::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }

    /* Заголовок Last Modified в таблицу */
    private static function lastMod($id)
    {
        $last = Content::findOne($id);
        $last->last_mod = time();
        $last->save();
    }
}
