#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<long long> prev(k), cur(k);
    for (auto& x : prev) cin >> x;
    for (int i = 1; i < n; i++) {
        // 어제 값 내림차순 상위 두 개의 번호
        int i1 = 0, i2 = 1;
        if (prev[i2] > prev[i1]) swap(i1, i2);
        for (int j = 2; j < k; j++) {
            if (prev[j] > prev[i1]) { i2 = i1; i1 = j; }
            else if (prev[j] > prev[i2]) i2 = j;
        }
        for (int j = 0; j < k; j++) {
            long long a;
            cin >> a;
            cur[j] = a + (j == i1 ? prev[i2] : prev[i1]);
        }
        swap(prev, cur);
    }
    cout << *max_element(prev.begin(), prev.end()) << "\n";
    return 0;
}
