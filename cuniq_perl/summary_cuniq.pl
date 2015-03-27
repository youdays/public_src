#!/usr/bin/perl -w

use strict;
use warnings;

#### 本来は /usr/local/bin/perl -w

my $sum = 0;
my $b_query;
my $b_label;

while(<>){
    #値取得
    chomp;
    my($query , $label , $count) = split(/\t/,$_);

    #値チェック
    next if(!defined($query) || !defined($label) || !defined($count));

    #取得した値が前の値とずれていた場合
    if(defined($b_query) && defined($b_label) &&
       "$query.$label"  ne "$b_query.$b_label"){
        print "$b_query\t$b_label\t$sum\n";
        $b_query = $query;
        $b_label = $label;
        $sum = $count;
    }
    #前の値と同じ
    else{
        $b_query = $query;
        $b_label = $label;
        $sum += $count;
    }
}

#最後のquery,label
if(defined($b_query) && defined($b_label)){
    print "$b_query\t$b_label\t$sum\n";
}
