#include<stdio.h>
int main(void){

    int arr[1000001] = {0};

    for(int i = 2; i < 1000000; i++){
        if(arr[i] == 0){
            for(j = i + i; j < 100000; j += i){
                arr[j] = 1;
            }
        }
    }
}
