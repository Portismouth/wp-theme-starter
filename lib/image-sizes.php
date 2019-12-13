<?php

function _themename_image_sizes() {
  add_image_size( 'about-page-highlights', 413, 422, true );
  add_image_size( 'about-page-hero', 1375, 915, true );
}

add_action( 'after_setup_theme', '_themename_image_sizes' );