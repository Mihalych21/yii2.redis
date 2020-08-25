<?php

namespace app\modules\admin\controllers;

use app\modules\admin\models\Msg;
use Yii;
//use yii\web\Controller;
use yii\filters\AccessControl;
use app\modules\admin\models\Content;
use yii\helpers\FileHelper;
use yii\web\View;

/**
 * Default controller for the `admin` module
 */
class DefaultController extends AppAdminController
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
            $flag = true;
            $header = '<h3>LastModified</h3>';
            return $this->renderPartial('modal', compact('result', 'flag', 'header'));

//            return $this->renderFile('@app/modules/admin/views/alert.php', compact('result'));
        }
    }

    /* Очистка кэша */
    public function actionCache()
    {
        if (Yii::$app->request->isAjax) {
//            sleep(3);
            $result = Yii::$app->cache->flush() ? true : false;
            $flag = true;
            $header = '<h3>Очистка кэша</h3>';
            return $this->renderPartial('modal', compact('result', 'flag', 'header'));

//            return $this->renderFile('@app/modules/admin/views/alert.php', compact('result'));
        }
    }

    /* Генерация файла Sitemap.xml */
    public function actionSitemap()
    {
        $siteRoot = __DIR__ . '/../../../web/';
        $contentPriority = 1;
        $XML = '';

        /* Таблица Content */

        $sql = 'SELECT `page`, `last_mod` FROM content WHERE 1';
        $content = Content::findBySql($sql)->asArray()->all();
        foreach ($content as $data) {
            if ($data['page'] != 'index') {
                $data['page'] = '/' . $data['page'];
            } else {
                $data['page'] = '';
            }

            $date = date('Y-m-d', $data['last_mod']);
            $XML .= "\r\n<url>\r\n\t<loc>https://www." . Yii::$app->params['siteUrl'] . $data['page'] . "</loc>\r\n\t<changefreq>weekly</changefreq>\r\n\t<lastmod>" . $date . "</lastmod>\r\n\t<priority>" . $contentPriority . "</priority>\r\n</url>";
        }


        $resXML = '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">'
            . $XML . "\n</urlset>";
        $fp = fopen($siteRoot . 'sitemap.xml', 'w+') or die('не могу открыть файл sitemap.xml !');

        $result = fwrite($fp, $resXML) ? true : false;
        $flag = true;
        $header = '<h3>Sitemap.xml</h3>';
        return $this->renderPartial('modal', compact('result', 'flag', 'header'));
//        return $this->renderFile('@app/modules/admin/views/alert.php', compact('result'));
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
            $header = '<h3>Очистка папок</h3>';
            return $this->renderPartial('modal', compact('fileCount', 'dirCount', 'errCount', 'header'));
        }
    }

    /* Помечаем все письма как прочитанные */
    public function actionPostlabel()
    {
        if (Yii::$app->request->isAjax) {
            $result = Msg::setPostAllRead();
            $flag = true;
            unset($_SESSION['newPostCount']);
            return $this->renderPartial('modal', compact('flag', 'result'));
        }
    }

    /* Помечаем все заказы обратных звонков как прочитанные */
    public function actionZvonoklabel()
    {
        if (Yii::$app->request->isAjax) {
            $result = Msg::setZvonokAllRead();
            $flag = true;
            unset($_SESSION['newCallCount']);
            return $this->renderPartial('modal', compact('flag', 'result'));
        }
    }
}
