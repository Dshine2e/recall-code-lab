#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    long long total = 0;
    vector<long long> diff(2 * n);
    for (int i = 0; i < 2 * n; i++) {
        long long a, b;
        cin >> a >> b;
        total += b;          // 일단 모두 오후로 보내고
        diff[i] = a - b;     // 오전으로 옮기면 바뀌는 비용
    }
    sort(diff.begin(), diff.end());
    for (int i = 0; i < n; i++) total += diff[i];
    cout << total << '\n';
    return 0;
}
