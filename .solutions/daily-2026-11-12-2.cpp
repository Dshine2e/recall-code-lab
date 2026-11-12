#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    string s;
    cin >> n >> s;
    // 누적 합의 범위는 -n..n 이므로 n 만큼 밀어서 배열 인덱스로 쓴다.
    vector<int> first(2 * n + 1, INT_MIN);
    first[n] = -1;
    int sum = 0, best = 0;
    for (int i = 0; i < n; i++) {
        sum += (s[i] == 'O') ? 1 : -1;
        int &f = first[sum + n];
        if (f == INT_MIN) f = i;
        else best = max(best, i - f);
    }
    cout << best << '\n';
}
