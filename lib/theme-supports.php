<?php 

function _themename_theme_supports() {
  add_theme_support( 'title-tag' );
  add_theme_support( 'post-thumbnails' );
  add_theme_support( 'html5', array('search-form', 'comment-list', 'comment-form', 'gallery', 'caption') );
  add_theme_support( 'align-wide' );
  add_theme_support( 'post-formats', array(
    'aside',
    'image',
    'video',
    'quote',
    'link',
    'gallery',
    'audio'
  ) );

  add_theme_support( 'editor-color-palette', array(
    array(
      'name' => __('Red', '_themename'),
      'slug' => 'red',
      'color' => '#FF3C43'
    ),
    array(
      'name' => __('Purple', '_themename'),
      'slug' => 'purple',
      'color' => '#CFB8FF'
    ),
    array(
      'name' => __('Off White', '_themename'),
      'slug' => 'off-white',
      'color' => '#F0ECE9'
    ),
    array(
      'name' => __('White', '_themename'),
      'slug' => 'white',
      'color' => '#fff'
    ),
    array(
      'name' => __('Black', '_themename'),
      'slug' => 'black',
      'color' => '#000000'
    )
  ));
}

add_action( 'after_setup_theme', '_themename_theme_supports' );