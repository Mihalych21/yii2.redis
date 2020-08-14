<?php

namespace app\modules\admin\controllers;

use Yii;
use yii\web\Controller;
use yii\filters\AccessControl;
use app\modules\admin\models\Content;
use yii\helpers\FileHelper;
/**
 * Default controller for the `admin` module
 */
class DefaultController extends Controller
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

    /**
     * Renders the index view for the module
     * @return string
     */
//    public $layout = 'admin'; // в конфиге прописал

    public function actionIndex()
    {
        return $this->render('index');
    }

    /* Для всех страниц заголовок Last Modified текущее время c небольшим разбросом */
    public function actionLast()
    {
        if (Yii::$app->request->isAjax) {
            // очищаем кэш
            Yii::$app->cache->flush();

            // таблица Content
            // start transaction
            $flag = true;
//            $transaction = Yii::$app->db->beginTransaction();
            $lastContent = Content::find()->where(true)->all();
//            debug($lastContent);die;
            foreach ($lastContent as $last) {
                $time = time() - rand(60, 300); // разброс от 1 до 5 минут
                $last->last_mod = $time;
                $res = $last->save();
                $flag = ($flag && $res) ? true : false;
                if (!$flag){
                    break;
                }
            }

            /*if ($flag){
//                $transaction->commit();
                $result = true;
            }else{
//                $transaction->rollBack();
                $result = false;
            }*/

            $result = $flag ? true : false;

            return $this->renderFile('@app/modules/admin/views/alert.php', compact('result'));
        }
    }

    /* Очистка кэша */
    public function actionCache()
    {
        if (Yii::$app->request->isAjax) {
            $result = Yii::$app->cache->flush() ? true : false;

            return $this->renderFile('@app/modules/admin/views/alert.php', compact('result'));
        }
    }

    /* Очистка временных и.т.п. папок */
    public function actionClear()
    {
        if (Yii::$app->request->isAjax) {
            require_once __DIR__ . '/../views/inc/dirArr.php';
            $fileCount = $dirCount = $errCount = 0; // счетчики
            foreach ($dirArr as $dirPath) {
                $dirPath = __DIR__ . '/../../../' . $dirPath;
                $fileArr =  FileHelper::findFiles($dirPath);
                $dirList = FileHelper::findDirectories($dirPath);
                // удаление файлов
                foreach ($fileArr as $filePath) {
                   if(isset($filePath)) {
                       $fRes = @unlink($filePath);
                   }
                        if ($fRes) {
                            $fileCount++;
                        } else {
                            $errCount++;
                        }
                }
                // удаление директорий (если есть)
                foreach ($dirList as $dir){
                   if(isset($dir)){
                     $dRes = @rmdir($dir);
                   }

                    if ($dRes) {
                        $dirCount++;
                    } else {
                        $errCount++;
                    }
                }
            }
            return $this->renderAjax('modal', compact('fileCount', 'dirCount', 'errCount'));
        }
    }
}
