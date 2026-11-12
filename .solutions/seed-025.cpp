#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const long long MOD = 1000000007LL;
    int n;
    string s;
    cin >> n >> s;
    // 직전 세 칸의 값만 들고 앞으로 민다. a=i-3, b=i-2, c=i-1 번 계단의 방법 수
    long long a = 0, b = 0, c = 1;  // 0번(땅)에 서는 방법은 1가지
    for (int i = 1; i <= n; i++) {
        long long cur = 0;
        if (s[i - 1] != '#') cur = (a + b + c) % MOD;
        a = b;
        b = c;
        c = cur;
    }
    cout << c << '\n';
}
