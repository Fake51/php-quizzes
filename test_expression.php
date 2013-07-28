<?php

$expression = empty($_GET['expression']) ? null : $_GET['expression'];
$answer     = empty($_GET['answer']) ? '' : strtolower($_GET['answer']);

if ($answer === 'true' || $answer === 'false' || preg_match("/^(-|+)?\\d+$/", $answer)) {
    $answer = eval('return ' . $answer . ';');
}


if (!preg_match('#^\\d+ ( |< |<= |>= |> |== |=== |!= |!== |<> |\\* |/ |% |\\+ |- |<< |>> |& |\\^ |\\| |&& |\\|\\| |and |xor |or |~ |\\(bool\\) |\\(int\\) |\\(string\\) |\\(float\\) |\\(unset\\) |! |\\d+)+$#', $expression)) {
    header('HTTP/1.1 400 Bad input');
    exit;
}

$expression_eval = eval('return ' . $expression . ';');

header('HTTP/1.1 200 Done');
header('Content-Type: application/json; charset=UTF-8');

$output = array(
    'answer' => $expression_eval,
    'guess'  => $answer,
    'result' => $expression_eval === $answer ? 1 : 0,
);

echo json_encode($output);
