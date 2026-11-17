#include <bits/stdc++.h>
using namespace std;

int n;
vector<long long> a;

long long atMost(long long x) {
    long long cnt = 0;
    int i = 0, j = n - 1;
    while (i < j) {
        if (a[i] + a[j] <= x) {
            cnt += j - i;
            i++;
        } else {
            j--;
        }
    }
    return cnt;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long lo, hi;
    cin >> n >> lo >> hi;
    a.resize(n);
    for (auto &x : a) cin >> x;
    sort(a.begin(), a.end());
    cout << atMost(hi) - atMost(lo - 1) << "\n";
    return 0;
}
