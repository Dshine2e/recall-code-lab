#include <bits/stdc++.h>
using namespace std;

static void put(int t) {
    t %= 1440;
    printf("%02d:%02d", t / 60, t % 60);
}

int main() {
    int hh, mm, n, b;
    if (scanf("%d:%d %d %d", &hh, &mm, &n, &b) != 4) return 0;
    long long cur = hh * 60 + mm;
    for (int i = 0; i < n; i++) {
        int a;
        scanf("%d", &a);
        put((int)(cur % 1440));
        printf("-");
        put((int)((cur + a) % 1440));
        printf("\n");
        cur += a + b;
    }
    return 0;
}
