<?php

function _themename_assets() {
  wp_enqueue_style( '_themename-stylesheet', get_template_directory_uri() . '/dist/assets/css/bundle.css', array(), '1.0.0', 'all' );

  wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css?family=Montserrat:200,300,400,500,900&display=swap', array(), '1.0.0', false);

  wp_enqueue_script( '_themename-scripts', get_template_directory_uri() . '/dist/assets/js/bundle.js', array( 'jquery' ), '1.0.0', true );

  if (is_singular( ) && comments_open( ) && get_option( 'thread_comments' )) {
    wp_enqueue_script( 'comment-reply' );
  }
}

add_action( 'wp_enqueue_scripts', '_themename_assets' );