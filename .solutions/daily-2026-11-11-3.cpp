#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    long long s;
    cin >> n >> s;
    vector<long long> a(n);
    for (auto& x : a) cin >> x;
    long long total = 0, count = 0;
    int left = 0;
    for (int right = 0; right < n; right++) {
        total += a[right];
        while (total > s) total -= a[left++];
        if (total == s) count++;
    }
    cout << count << '\n';
}
