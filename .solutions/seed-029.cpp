#include <bits/stdc++.h>
using namespace std;

int main() {
    int h, m, n;
    if (scanf("%d:%d", &h, &m) != 2) return 0;
    scanf("%d", &n);
    int hour = h, minute = m, days = 0;
    for (int i = 0; i < n; i++) {
        int d;
        scanf("%d", &d);
        minute += d;
        hour += minute / 60;
        minute %= 60;
        days += hour / 24;
        hour %= 24;
        printf("%02d:%02d\n", hour, minute);
    }
    printf("%d\n", days);
    return 0;
}
