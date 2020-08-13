<?php

namespace app\controllers;

use app\models\IndexForm;
use app\models\User;
use yii\helpers\Html;
use app\models\Content;
use app\models\LoginForm;
use app\models\CallForm;
use app\models\Callback;
use app\models\Post;
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
                        'actions' => ['login', 'logout'],
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
            'rateLimiter' => [
                // сторонняя фича. Пишется в кэш.Бд не трогается.
                'class' => \ethercreative\ratelimiter\RateLimiter::className(),
                'only' => ['login', 'mail_ok'],
                // The maximum number of allowed requests
                'rateLimit' => Yii::$app->params['rateLimit'],
                // The time period for the rates to apply to
                'timePeriod' => 60,
                // Separate rate limiting for guests and authenticated users
                // Defaults to true
                // - false: use one set of rates, whether you are authenticated or not
                // - true: use separate ratesfor guests and authenticated users
                'separateRates' => false,
                // Whether to return HTTP headers containing the current rate limiting information
                'enableRateLimitHeaders' => false,
                'errorMessage' => 'Лимит запросов исчерпан. Не более ' . Yii::$app->params['rateLimit'] . ' попыток в минуту',
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
        $indexForm = new IndexForm();
        $data = $model->getContent();

        return $this->render('index', ['data' => $data, 'indexForm' => $indexForm]);
    }

    /* Отправка почты с главной страницы */
    public function actionMail_ok()
    {
        $request = Yii::$app->request;
        if ($request->isPost){ // данные отправлены

            $name = clr_get(Html::encode(ucfirst($request->post()['IndexForm']['name'])));
            $email = clr_get(Html::encode($request->post()['IndexForm']['email']));
            $tel = clr_get(Html::encode($request->post()['IndexForm']['tel']));
            $text = clr_get(Html::encode($request->post()['IndexForm']['text']));

            $post = new Post();
            // отправка email и запись письма в БД
            $success = $post->mailSend($name, $email, $tel, $text);

            return $this->renderAjax('mail_ok', compact('success', 'name'));
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
//        die('HERRRRE');
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
            $name = clr_get(Html::encode(ucfirst($data['callForm']['name'])));
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
