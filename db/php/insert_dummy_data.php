<?

require(__DIR__ .'/util.php');

#ダミーデータ
$titles = array(
    '男が食べたいお菓子',
    '春のお菓子サミット',
    'お菓子であなたの性格がわかる！？',
    'いつもかばんに入っているのはどれだ？'
);

$tags = array(
    '1' => 'シチュエーション',
    '1' => '連載',
    '2' => '新商品紹介',
    '2' => '連載',
    '3' => 'ランキング',
    '4' => 'ランキング'
);

foreach($titles as $title){
    if(insertArticle($title)){
        echo "ok!\n";
    } else{
        echo 'articleのインサートエラー';
    }
    sleep(1);
}

foreach($tags as $article_id => $value){
    if(insertArticleTag($article_id, $value)){
        echo "ok!\n";
    } else{
        echo 'articleのインサートエラー';
    }
    sleep(1);
}
