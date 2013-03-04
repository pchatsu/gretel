<?php
# config/config.phpをつくって、そこに各環境でのmysqlの情報を書く。
# 書式:
# define ('DB_NAME', 'mysql:dbname=gretel;host=localhost');
# define ('DB_USER', 'gretel');
# define ('DB_PASSWORD', '');

require(__DIR__ .'/../../config/config.php');

#articleのinsert
function insertArticle($title){
    try {
        $dbh = new PDO(DB_NAME, DB_USER, DB_PASSWORD);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $dbh->prepare('INSERT INTO article (id, title, create_date) VALUES (NULL, :title, NULL)');
        $stmt->bindValue(':title', $title);
        $stmt->execute();
        return true;
    }
    catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
}

#article_tagのinsert
function insertArticleTag($article_id, $value){
    try {
        $dbh = new PDO(DB_NAME, DB_USER, DB_PASSWORD);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $dbh->prepare('INSERT INTO article_tag (id, article_id, value, create_date) VALUES (NULL, :article_id, :value, NULL)');
        $stmt->bindValue(':value', $value);
        $stmt->bindValue(':article_id', $article_id);
        $stmt->execute();
        return true;
    }
    catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
}

function selectLatestFromArticle(){
    try {
        $dbh = new PDO(DB_NAME, DB_USER, DB_PASSWORD);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $dbh->prepare('SELECT * FROM article ORDER BY create_date DESC limit 3;');
        $stmt->execute();
        return $stmt->fetchAll();
    }
    catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
}
