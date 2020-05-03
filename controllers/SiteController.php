<?php

namespace app\controllers;

use yii\helpers\Html;
use app\models\Content;
use app\models\LoginForm;
use app\models\CallForm;
use app\models\Callback;
use app\models\Posts;
use Yii;
use yii\filters\AccessControl;
use yii\filters\VerbFilter;
use yii\web\Controller;

class SiteController extends Controller
{
    /*public function actionError()
    {
        $errorCode = Yii::$app->errorHandler->exception->statusCode;
        $errorMsg = Yii::$app->errorHandler->exception->getMessage();
            if ($errorCode == 404) {
                $this->layout = 'error';
               return $this->render('_404', ['errorMsg' => $errorMsg]);
            }
    }*/
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    /*public function actionIndex()
    {
        return $this->render('index');
    }*/
    public function actionIndex()
    {
        $model = new Content();
        $data = $model->getContent();

        return $this->render('index', ['data' => $data]);
    }

    /* Отправка почты с главной страницы */
    public function actionMail_ok()
    {
        $request = Yii::$app->request;
        if ($request->isPost && $request->post('index_form') === '1'){ // данные отправлены

        $name = clr_get(Html::encode(mb_ucfirst($request->post('name'))));
        $email = clr_get(Html::encode($request->post('email')));
        $tel = clr_get(Html::encode($request->post('tel')));
        $msg = clr_get(Html::encode($request->post('text')));

        // отправка email и запись письма в БД
        $post = new Posts();
        $success = $post->mailSend($name, $email, $tel, $msg);

        return $this->renderAjax('mail_ok', compact('success',  'name'));
        }
    }

    public function actionSozdanie() {
        $model = new Content();
        $data = $model->getContent();

        return $this->renderAjax('sozdanie', ['data' => $data]);
    }

    public function actionProdvijenie() {
        $model = new Content();
        $data = $model->getContent();

        return $this->renderAjax('prodvijenie', ['data' => $data]);
    }

    public function actionParsing() {
        $model = new Content();
        $data = $model->getContent();

        return $this->renderAjax('parsing', ['data' => $data]);
    }

    public function actionPortfolio() {
        $model = new Content();
        $data = $model->getContent();

        return $this->renderAjax('portfolio', ['data' => $data]);
    }

    /**
     * Login action.
     *
     * @return string
     */
    public function actionLogin()
    {
        $this->layout = 'login';
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        }
        return $this->render('login', [
            'model' => $model,
        ]);
    }

    /**
     * Logout action.
     *
     * @return string
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    public function actionPolitic()
    {
       return $this->renderFile(__DIR__ . '/../views/site/politic.php');
    }

    /* Виджет обратного звонка */
    public function actionCall()
    {
        $request = Yii::$app->request;

        if($request->isPost  && $request->post('call') === '1'){ // Форма отправлена
            $data = $request->post();
            $name = clr_get(Html::encode(mb_ucfirst($data['callForm']['name'])));
            $tel = clr_get(Html::encode($data['callForm']['tel']));

            // Отправка email и запись в БД
            $call = new Callback();
            $res = $call->callSend($name, $tel);

            return $this->renderAjax('call_ok', compact( 'res'));
        }

        // модальное окно с формой
        $model = new CallForm();
        return $this->renderAjax('call', ['model' => $model]);
    }

}
